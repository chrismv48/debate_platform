Rails.application.routes.draw do
  resources :arguments
  resources :sources
  resources :premises

  get '/premises/premise_form/:id', to: 'premises#premise_form', as: 'premise_form'

  root 'arguments#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
