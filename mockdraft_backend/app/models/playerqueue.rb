class PlayerQueue < ApplicationRecord
    belongs_to :player
    belongs_to :queue
    belongs_to :roster, source: :player
    belongs_to :owner, source: :player
end