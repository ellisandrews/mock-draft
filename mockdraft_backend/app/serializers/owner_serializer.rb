class OwnerSerializer

    @@options = {
        include: {
            roster: {
                except: [:created_at, :updated_at]
            },
            queued_players: {
                except: [:created_at, :updated_at]
            },
            rostered_players: {
                except: [:created_at, :updated_at]
            }
        },
        except: [:created_at, :updated_at],
    }

    def initialize(owner)
        @owner = owner
    end

    def to_serialized_hash
        @owner.as_json(@@options)
    end

    def to_serialized_json
        @owner.to_json(@@options)
    end

end
