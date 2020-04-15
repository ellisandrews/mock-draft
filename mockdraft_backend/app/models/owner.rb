class Owner < ApplicationRecord
  has_one :roster
  has_many :queue_items
  has_many :queued_players, through: :queue_items, source: :player
  has_many :rostered_players, through: :roster, source: :players
end
