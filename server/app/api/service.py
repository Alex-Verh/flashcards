import os
import secrets

from flask import current_app, jsonify, redirect, request, url_for
from flask_login import current_user

from ..extensions import db
from ..funcs import delete_cardset_files, save_audio, save_image
from ..models import (
    CardSet,
    CardSetCategory,
    FlashCard,
    cardsets_view,
    user_cardset_assn,
)


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
            is_public=cls._parse_bool(request.form.get("is_public", default=False)),
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
        if cardset.user_id == current_user.id:
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
            "saves": cardsets_view.c.total_saves,
            "title": cardsets_view.c.title,
            "date": cardsets_view.c.created_at,
        }
        try:
            params = cls._get_cardset_params(sort_by)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid request parameters"}), 400

        cardsets_query_results = cls._create_cardsets_query(params, sort_by).all()
        cardsets = cls._transform_cardsets_query_results(cardsets_query_results)

        return jsonify(cardsets), 200

    @classmethod
    def _get_cardset_params(cls, allowed_sort_by):
        params = {
            "offset": int(request.args.get("offset", default=0)),
            "limit": int(request.args.get("limit", default=16)),
            "category_id": int(request.args.get("categoryId", default=0)),
            "search_query": request.args.get("searchQ"),
            "sort_by": request.args.get("sortBy", default="saves"),
            "sort_order": request.args.get("sortOrder", default="desc"),
            "only_own": cls._parse_bool(request.args.get("onlyOwn", default=False)),
            "only_saved": cls._parse_bool(request.args.get("onlySaved", default=False)),
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
        if params["only_saved"]:
            if not current_user.is_authenticated:
                return jsonify({"error": "Not authorized"}), 401
            query = (
                db.session.query(cardsets_view, True)
                .filter(user_cardset_assn.c.user_id == current_user.id)
                .filter(cardsets_view.c.id == user_cardset_assn.c.cardset_id)
                .filter(cardsets_view.c.is_public)
            )

        elif params["only_own"]:
            if not current_user.is_authenticated:
                return jsonify({"error": "Not authorized"}), 401
            query = db.session.query(
                cardsets_view,
                False,
            ).filter(cardsets_view.c.author_id == current_user.id)

        else:
            query = db.session.query(
                cardsets_view,
                cardsets_view.c.id.in_(
                    db.select(CardSet.id)
                    .filter(user_cardset_assn.c.user_id == current_user.id)
                    .filter(CardSet.id == user_cardset_assn.c.cardset_id)
                )
                if current_user.is_authenticated
                else False,
            ).filter(cardsets_view.c.is_public)

        if params["search_query"]:
            query = query.filter(
                cardsets_view.c.title.like("%" + params["search_query"] + "%")
            )

        if params["category_id"]:
            query = query.filter(cardsets_view.c.category_id == params["category_id"])

        query = (
            query.order_by(getattr(sort_map[params["sort_by"]], params["sort_order"])())
            .limit(params["limit"])
            .offset(params["offset"])
        )
        return query

    @classmethod
    def _transform_cardsets_query_results(cls, results):
        return [
            {
                "id": cardset[0],
                "title": cardset[1],
                "category": {"id": cardset[2], "title": cardset[3]},
                "author": {"id": cardset[4], "username": cardset[5]},
                "saves": cardset[6],
                "flashcards_qty": cardset[7],
                "is_saved": cardset[-1],
                "is_own": cardset[4] == current_user.id
                if current_user.is_authenticated
                else False,
            }
            for cardset in results
        ]

    @classmethod
    def _parse_bool(cls, value):
        return str(value).lower() in ["yes", "true", "1"]

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
