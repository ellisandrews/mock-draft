class Player < ApplicationRecord
  belongs_to :roster, optional: true
  has_many :queue_items
  has_one :owner, through: :roster
end
