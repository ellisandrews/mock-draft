class Roster < ApplicationRecord
  belongs_to :owner
  has_many :players
  has_many :playerqueues, source: :player
end