class RosterSerializer

    @@options = {
        include: {
            players: {
                except: [:created_at, :updated_at]
            },
            owner: {
                except: [:created_at, :updated_at]
            }
        },
        except: [:owner_id, :created_at, :updated_at],
    }

    def initialize(roster)
        @roster = roster
    end

    def to_serialized_hash
        @roster.as_json(@@options)
    end

    def to_serialized_json
        @roster.to_json(@@options)
    end

end
