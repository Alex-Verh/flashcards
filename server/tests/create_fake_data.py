from faker import Faker
import random

from werkzeug.security import generate_password_hash

from app.models import User, CardSet, FlashCard, CardSetCategory


fake = Faker()


def create_categories(db):
    categories = [
        "Math",
        "Science",
        "Language",
        "History",
        "Geography",
        "Literature",
        "Art",
        "Music",
        "Philosophy",
        "Religion",
        "Sports",
        "Health and Medicine",
        "Business and Economics",
        "Law",
        "Technology",
        "Social Sciences",
        "Psychology",
        "Education",
        "Politics",
        "Environmental Studies",
        "Other",
    ]
    for category in categories:
        cardset_cat = CardSetCategory(title=category)
        db.session.add(cardset_cat)
    db.session.commit()
    print("Card set categories has been created")


def create_users(db, quantity=500):
    for _ in range(quantity):
        username = fake.unique.user_name()
        user = User(
            email=fake.unique.email(),
            username=username,
            password=generate_password_hash(username.capitalize()),
            created_at=fake.date_time_this_year(),
        )
        db.session.add(user)
    db.session.commit()
    print("Users has been created")


def create_cardsets(db, quantity=2500):
    users = User.query.all()
    for _ in range(quantity):
        user = random.choice(users)
        cardset = CardSet(
            title=fake.text(50),
            is_public=random.choices([True, False], [70, 30])[0],
            category_id=random.randrange(1, 22),
            user_id=user.id,
            created_at=fake.date_time_between(start_date=user.created_at),
        )
        db.session.add(cardset)
    db.session.commit
    print("Card sets has been created")


def create_flashcards(db, quantity=10000):
    cardsets = CardSet.query.all()

    for _ in range(quantity):
        cardset = random.choice(cardsets)
        attachments = {
            "frontside": {
                "images": [
                    fake.file_name(category="image", extension="jpg")
                    for _ in range(random.randint(0, 2))
                ],
                "audio": random.choices(
                    [None, fake.file_name(category="audio", extension="mp3")], [80, 20]
                )[0],
            },
            "backside": {
                "images": [
                    fake.file_name(category="image", extension="jpg")
                    for _ in range(random.randint(0, 3))
                ],
                "audio": random.choices(
                    [None, fake.file_name(category="audio", extension="mp3")], [80, 20]
                )[0],
            },
        }

        flashcard = FlashCard(
            title=fake.text(50),
            content=fake.paragraph(),
            attachments=attachments,
            cardset_id=cardset.id,
            created_at=fake.date_time_between(start_date=cardset.created_at),
        )
        db.session.add(flashcard)
    db.session.commit()
    print("Flash cards has been created")


def create_user_cardset_assns(db):
    users = User.query.all()
    cardsets = CardSet.query.filter_by(is_public=True).all()

    for user in users:
        k = random.randint(7, 20)
        saved_card_sets = random.sample(cardsets, k)
        user.saved_cardsets.extend(saved_card_sets)

    db.session.commit()
    print("Card set saves has been created")


def create_fake_data(database):
    create_categories(database)
    create_users(database)
    create_cardsets(database)
    create_flashcards(database)
    create_user_cardset_assns(database)
