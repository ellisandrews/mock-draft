class QueuesController < ApplicationController

    def index
        @queues = Queue.all
    end
    
def