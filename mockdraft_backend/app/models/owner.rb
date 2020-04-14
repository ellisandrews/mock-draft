class Owner < ApplicationRecord
  has_one :roster
  has_one :queue
  has_many :players, through: :roster
  has_many :playerqueues, source: :player
end