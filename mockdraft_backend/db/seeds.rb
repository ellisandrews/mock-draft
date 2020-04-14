require 'open-uri'
require 'json'

url = "https://www.fantasyfootballnerd.com/service/draft-rankings/json/test"

json = JSON.load(open(url))
json["DraftRankings"].each do |player|
    Player.create!({
        "position": player["position"],
        "first_name": player["fname"],
        "last_name": player["lname"],
        "team": player["team"],
        "nerd_rank": player["nerdRank"],
        "position_rank": player["positionRank"],
        "overall_rank": player["overallRank"],
        "bye_week": player["byeWeek"]
    })
end