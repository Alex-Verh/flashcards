"""Improved structure

Revision ID: afcfd1571fd9
Revises: 35b55168f521
Create Date: 2023-02-25 20:38:46.124710

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'afcfd1571fd9'
down_revision = '35b55168f521'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_cardset_assn',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('cardset_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['cardset_id'], ['card_sets.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'cardset_id')
    )
    op.drop_table('card_set_saves')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('card_set_saves',
    sa.Column('cardset_id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['cardset_id'], ['card_sets.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('cardset_id', 'user_id')
    )
    op.drop_table('user_cardset_assn')
    # ### end Alembic commands ###