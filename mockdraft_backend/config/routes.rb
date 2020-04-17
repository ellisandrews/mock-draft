Rails.application.routes.draw do

  resources :owners, only: [:index, :show, :create]
  resources :players, only: [:index, :show, :update]
  resources :rosters, only: [:index, :show, :create, :update]
  resources :queue_items, only: [:create, :destroy]

  # Custom endpoint for resetting all the players' roster_ids and roster_positions to NULL
  post '/players/reset', to: 'players#reset'

end
