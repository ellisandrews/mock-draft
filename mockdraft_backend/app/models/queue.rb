class Queue < ApplicationRecord
  belongs_to :owner
  has_many :playerqueues
  has_many :players, through: :playerqueue
end
