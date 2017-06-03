Rails.application.routes.draw do
  resources :arguments
  resources :sources
  resources :premises

  root 'arguments#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
