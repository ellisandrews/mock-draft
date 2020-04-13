require 'open-uri'
require 'json'

url = "https://www.fantasyfootballnerd.com/service/draft-rankings/json/test"

JSON.load(url) do |json|
    json["DraftRankings"].each do |player|
        @item = JSON.parse(player)
        ob = {
            "position": @item["position"],
            "first_name": @item["fname"],
            "last_name": @item["lname"],
            "team": @item["team"],
            "nerd_rank": @item["nerdRank"],
            "position_rank": @item["positionRank"],
            "overall_rank": @item["overallRank"],
            "bye_week": @item["byeWeek"]
        }
        Player.create!(ob)
    end
end