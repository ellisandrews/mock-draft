Rails.application.routes.draw do

  resources :owners, only: [:index, :show, :create]
  resources :players, only: [:index, :show, :update]
  resources :rosters, only: [:index, :show, :create, :update]
  resources :queue_items, only: [:create, :destroy]

end
