class PlayersController < ApplicationController

    def index
        players = Player.all
        render json: players.map { |player| PlayerSerializer.new(player).to_serialized_hash }
    end

    def show
        player = Player.find(params[:id])
        render json: PlayerSerializer.new(player).to_serialized_json
    end

    def update
       player = Player.find(params[:id])
       player.update!(player_params)
       render json: PlayerSerializer.new(player).to_serialized_json
    end

    def reset
        Player.update_all roster_id: nil, roster_position: nil
        players = Player.all
        render json: players.map { |player| PlayerSerializer.new(player).to_serialized_hash }
    end

    private

    def player_params
        params.permit(:roster_id, :roster_position)
    end

end
