Rails.application.routes.draw do
  resources :arguments
  resources :sources
  resources :premises

  get '/arguments/:id/argument_tree', to: 'arguments#argument_tree', as: 'argument_tree'

  root 'arguments#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
