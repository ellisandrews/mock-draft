class Player < ApplicationRecord
  belongs_to :owner
  belongs_to :roster
  has_many :playerqueues
  has_many :queues, through: :playerqueue
end
