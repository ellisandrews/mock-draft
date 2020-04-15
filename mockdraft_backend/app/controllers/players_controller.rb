class PlayersController < ApplicationController

    def index
        players = Player.all
        render json: players
    end

    def show
        player = Player.find(params[:id])
        render json: player
    end

    def update
       player = Player.find(params[:id])
       player.update!(player_params)
       render json: player
    end

    private

    def player_params
        params.permit(:roster_id, :roster_position)
    end

end
