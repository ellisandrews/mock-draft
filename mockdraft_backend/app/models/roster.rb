class Roster < ApplicationRecord
  has_one :owner
  has_many :players, through: :owner
  has_many :playerqueues, through: :player
end
