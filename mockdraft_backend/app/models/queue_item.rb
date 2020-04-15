class QueueItem < ApplicationRecord
  belongs_to :owner
  belongs_to :player
end
