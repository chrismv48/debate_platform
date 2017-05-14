# == Schema Information
#
# Table name: sources
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Source < ApplicationRecord
  has_many :premise_sources
  has_many :premises, through: :premise_sources, dependent: :delete_all
end
