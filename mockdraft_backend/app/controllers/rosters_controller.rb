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
        roster = Roster.create!(roster_params)
        render json: RosterSerializer.new(roster).to_serialized_json
    end

    def update
        roster = Roster.find(params[:id])
        roster.update!(roster_params)
        render json: RosterSerializer.new(roster).to_serialized_json
    end

    private

    def roster_params
        params.permit(:name, :owner_id)
    end

end
