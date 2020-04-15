require 'open-uri'
require 'json'

# Load the Players
url = "https://www.fantasyfootballnerd.com/service/draft-rankings/json/test"

json = JSON.load(open(url))
json["DraftRankings"].each do |player|
    Player.create!({
        "position": player["position"],
        "first_name": player["fname"],
        "last_name": player["lname"],
        "team": player["team"],
        "nerd_rank": player["nerdRank"].to_f,
        "position_rank": player["positionRank"].to_i,
        "overall_rank": player["overallRank"].to_i,
        "bye_week": player["byeWeek"].to_i
    })
end

# Create fake owners
19.times do
    name = "#{Faker::Name.first_name} #{Faker::Name.last_name}"
    owner = Owner.create!(name: name)
    roster = Roster.create!(name: "#{name}'s Team", owner: owner)
end
