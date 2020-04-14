@pos_maxes = {"RB": 2, "QB": 1, "WR": 2, "TE": 1, "DEF": 1, "K": 1}

roster = []

players = [
    {:position=>"QB", :name=>"Tom Brady"},
    {:name=>"Adrian Peterson", :position=>"RB"},
    {:name=>"Rob Gronkowski", :position=>"TE"},
    {:name=>"Travis Kelce", :position=>"TE"},
    {:position => "RB", :name => "Zeke Elliot"},
    {:position => "RB", :name => "Saquon Barkley"}
]


def mapper(roster, player)
    pos = player[:position]
    pos_count = roster.count { |pl| pl[:position] == pos}
    pos_max = @pos_maxes[pos.to_sym]
    if pos_count < pos_max
        if pos_max == 1
            return pos
        else
            return pos + (pos_count + 1).to_s
        end
    elsif pos_count == pos_max
        if !roster.find { |pl| pl[:roster_position] == "FLEX" } && ["RB", "WR", "TE"].include?(pos)
            return "FLEX"
        else
            return "BENCH"
        end
    else
        return "BENCH"
    end
end

def add_player(roster, player)
    player[:roster_position] = mapper(roster, player)
    roster << player
end

players.each { |player| add_player(roster, player)}