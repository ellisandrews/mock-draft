class RostersController < ApplicationController

    def index
        rosters = Roster.all
        render json: rosters.map { |roster| RosterSerializer.new(roster).to_serialized_hash }
    end

    def show
        roster = Roster.find(params[:id])
        render json: RosterSerializer.new(roster).to_serialized_json
    end

    def create
        
    end

    def update
    end

end

