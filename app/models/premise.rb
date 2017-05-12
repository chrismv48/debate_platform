class Premise < ApplicationRecord
  has_and_belongs_to_many :arguments
  has_and_belongs_to_many :sources

end
