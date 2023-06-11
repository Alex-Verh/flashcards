import os
import secrets

from flask import current_app, jsonify, redirect, request, url_for
from flask_login import current_user

from ..extensions import db
from ..funcs import delete_cardset_files, save_audio, save_image
from ..models import CardSet, CardSetCategory, FlashCard, user_cardset_assn


class ApiService:
    @classmethod
    def get_categories(cls):
        categories = [
            {"id": cat.id, "title": cat.title} for cat in CardSetCategory.query
        ]
        return jsonify(categories)

    @classmethod
    def get_cardset(cls, id):
        cardset: CardSet = CardSet.query.get(id)
        if not cardset:
            return jsonify({"error": "Card set does not exist."}), 400

        if (not cardset.is_public) and cardset.author != current_user:
            return jsonify({"error": "You can not access this card set"}), 403

        response = {
            "id": cardset.id,
            "title": cardset.title,
            "category": {"id": cardset.category.id, "title": cardset.category.title},
            "flashcards": [],
        }

        for flash_card in cardset.flash_cards:
            response["flashcards"].append(
                {
                    "id": flash_card.id,
                    "title": flash_card.title,
                    "content": flash_card.content,
                    "attachments": flash_card.attachments,
                }
            )

        return jsonify(response)

    @classmethod
    def create_cardset(cls):
        cardset = CardSet(
            title=request.form.get("title"),
            is_public=request.form.get("is_public", default=0, type=int),
            category_id=request.form.get("category", default=21, type=int),
            user_id=current_user.id,
        )
        db.session.add(cardset)
        db.session.commit()

        return redirect(url_for("cards.cardset", id=cardset.id))

    @classmethod
    def delete_cardset(cls, id):
        cardset = CardSet.query.get(id)
        if not cardset:
            return jsonify({"error": "Card set does not exist."}), 400

        if cardset.user_id == current_user.id:
            uploads_dir_path = os.path.join(
                current_app.root_path, current_app.config["UPLOAD_FOLDER"]
            )
            delete_cardset_files(current_user.id, cardset.id, uploads_dir_path)

            db.session.delete(cardset)
            db.session.commit()
        else:
            return (
                jsonify(
                    {"error": "You do not have permission to delete this card set"}
                ),
                400,
            )

        return jsonify({"message": "Card set has been deleted"})

    @classmethod
    def save_cardset(cls, id):
        cardset = CardSet.query.get(id)
        if not cardset:
            return jsonify({"error": "Card set does not exist."}), 400
        if cardset.author == current_user:
            return jsonify({"error": "You can not save your own card set"}), 400

        saved = bool(
            current_user.saved_cardsets.filter(CardSet.id == cardset.id).first()
        )
        if saved:
            current_user.saved_cardsets.remove(cardset)
        else:
            current_user.saved_cardsets.append(cardset)
        db.session.commit()
        saved = not saved

        return jsonify({"saves": cardset.followers.count(), "saved": saved})

    @classmethod
    def get_cardsets(cls):
        sort_by = {
            "saves": "total_saves",
            "date": "card_sets.created_at",
            "title": "card_sets.title",
        }
        try:
            params = cls._get_cardset_params(sort_by)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid request parameters"}), 400

        query = cls._create_cardsets_query(params, sort_by)

        result = []
        for row in query:
            try:
                saved = params["only_saved"] or bool(
                    current_user.saved_cardsets.filter(CardSet.id == row[0].id).first()
                )
                own = params["only_own"] or row[0].author == current_user
            except AttributeError:
                saved = False
                own = False

            cardset = {
                "id": row[0].id,
                "title": row[0].title,
                "category": row[0].category.title,
                "author": row[0].author.username,
                "saves": row[1],
                "flashcards_qty": row[2],
                "is_saved": saved,
                "is_own": own,
            }
            result.append(cardset)

        return jsonify(result), 200

    @classmethod
    def _get_cardset_params(cls, allowed_sort_by):
        params = {
            "offset": int(request.args.get("offset", default=0)),
            "limit": int(request.args.get("limit", default=16)),
            "category_id": int(request.args.get("categoryId", default=0)),
            "search_query": request.args.get("searchQ"),
            "sort_by": request.args.get("sortBy", default="saves"),
            "sort_order": request.args.get("sortOrder", default="desc"),
            "only_own": request.args.get("onlyOwn", default=False),
            "only_saved": request.args.get("onlySaved", default=False),
        }
        if (
            params["offset"] < 0
            or params["limit"] < 0
            or params["category_id"] < 0
            or params["sort_by"] not in allowed_sort_by
            or params["sort_order"] not in ["asc", "desc"]
            or (params["only_own"] and params["only_saved"])
        ):
            raise ValueError
        return params

    @classmethod
    def _create_cardsets_query(cls, params, sort_map):
        query = (
            db.session.query(
                CardSet,
                db.text("count(user_cardset_assn.cardset_id) AS total_saves"),
                db.text("count(flash_cards.id) AS total_flashcards"),
            )
            .join(user_cardset_assn, isouter=True)
            .join(FlashCard)
            .filter(CardSet.is_public)
        )

        if params["only_own"]:
            if not current_user.is_authenticated:
                return jsonify({"error": "Not authorized"}), 401
            query = query.filter(CardSet.author == current_user)

        if params["only_saved"]:
            if not current_user.is_authenticated:
                return jsonify({"error": "Not authorized"}), 401
            print(current_user.saved_cardsets.all())
            query = query.filter(
                db.and_(
                    user_cardset_assn.c.cardset_id == CardSet.id,
                    user_cardset_assn.c.user_id == current_user.id,
                )
            )

        if params["search_query"]:
            query = query.filter(CardSet.title.like("%" + params["search_query"] + "%"))

        if params["category_id"]:
            query = query.filter(CardSet.category_id == params["category_id"])

        query = (
            query.group_by(CardSet.id)
            .order_by(db.text(f"{sort_map[params['sort_by']]} {params['sort_order']}"))
            .limit(params["limit"])
            .offset(params["offset"])
        )
        print(query)
        return query

    @classmethod
    def create_flashcard(cls):
        cardset_id = request.form.get("cardset_id")
        cardset = CardSet.query.get(cardset_id)

        if cardset not in current_user.own_cardsets.all():
            return jsonify({"error": "This card set is not yours"}), 400

        base_filename = f"{current_user.id}_{cardset_id}_"
        uploads_dir_path = os.path.join(
            current_app.root_path, current_app.config["UPLOAD_FOLDER"]
        )

        flashcard_attachments = {
            "frontside": {"images": []},
            "backside": {"images": []},
        }

        cls._save_flashcard_images(
            flashcard_attachments, base_filename, uploads_dir_path
        )

        cls._save_flashcard_audio(
            flashcard_attachments, base_filename, uploads_dir_path
        )

        flashcard = FlashCard(
            title=request.form.get("title"),
            content=request.form.get("content"),
            attachments=flashcard_attachments,
            cardset_id=cardset_id,
        )
        db.session.add(flashcard)
        db.session.commit()

        return jsonify({"message": "Files uploaded and resized successfully"}), 200

    @classmethod
    def _save_flashcard_audio(
        cls, flashcard_attachments, base_filename, uploads_dir_path
    ):
        front_audio = request.files.get("front_audio")
        back_audio = request.files.get("back_audio")
        if front_audio:
            flashcard_attachments["frontside"]["audio"] = save_audio(
                front_audio, base_filename + secrets.token_hex(6), uploads_dir_path
            )
        if back_audio:
            flashcard_attachments["backside"]["audio"] = save_audio(
                back_audio, base_filename + secrets.token_hex(6), uploads_dir_path
            )

    @classmethod
    def _save_flashcard_images(
        cls, flashcard_attachments, base_filename, uploads_dir_path
    ):
        front_images = request.files.getlist("front_images")
        back_images = request.files.getlist("back_images")
        for image in front_images:
            image_filename = save_image(
                image, base_filename + secrets.token_hex(6), uploads_dir_path
            )
        flashcard_attachments["frontside"]["images"].append(image_filename)
        for image in back_images:
            image_filename = save_image(
                image, base_filename + secrets.token_hex(6), uploads_dir_path
            )
            flashcard_attachments["backside"]["images"].append(image_filename)

    @classmethod
    def delete_flashcard(cls, id):
        pass
