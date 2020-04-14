class Player < ApplicationRecord
  belongs_to :roster, optional: true
  has_many :playerqueues
  has_many :queues, through: :playerqueue
end