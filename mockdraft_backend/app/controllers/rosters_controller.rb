class RostersController < ApplicationController

    def index
        @rosters = RostersController.all
    end
    
def