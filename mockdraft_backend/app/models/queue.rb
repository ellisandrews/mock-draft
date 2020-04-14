class Queue < ApplicationRecord
  has_one :owner
  has_many :playerqueues
  has_many :players, through: :playerqueue
end
