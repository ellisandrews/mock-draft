class QueueItemsController < ApplicationController

    def create
        queue_item = QueueItem.create!(queue_item_params)
        render json: queue_item
    end

    def destroy
        queue_item = QueueItem.find(params[:id])
        queue_item.destroy!
        render json: queue_item
    end
    
    private

    def queue_item_params
        params.permit(:player_id, :owner_id)
    end

end