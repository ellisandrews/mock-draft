class OwnersController < ApplicationController

    def index
        owners = Owner.all
        render json: owners.map { |owner| OwnerSerializer.new(owner).to_serialized_hash }
    end

    def show
        owner = Owner.find(params[:id])
        render json: OwnerSerializer.new(owner).to_serialized_json
    end

    def create
        owner = Owner.create!(owner_params)
        render json: OwnerSerializer.new(owner).to_serialized_json
    end

    def update
        owner = Owner.find(params[:id])
        owner.update!(owner_params)
        render json: OwnerSerializer.new(owner).to_serialized_json
    end

    private

    def owner_params
        params.permit(:name, :owner_id)
    end
    
end