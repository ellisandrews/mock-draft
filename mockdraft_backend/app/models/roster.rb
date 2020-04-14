class Roster < ApplicationRecord
  has_one :owner
  has_many :players
  has_many :playerqueues, source: :player
end