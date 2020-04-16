class PlayerSerializer

    @@options = {
        include: {
            owner: {
                except: [:created_at, :updated_at]
            }
        },
        except: [:created_at, :updated_at],
    }

    def initialize(player)
        @player = player
    end

    def to_serialized_hash
        @player.as_json(@@options)
    end

    def to_serialized_json
        @player.to_json(@@options)
    end

end