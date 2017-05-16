# == Schema Information
#
# Table name: premises
#
#  id          :integer          not null, primary key
#  argument_id :integer
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_premises_on_argument_id  (argument_id)
#

class Premise < ApplicationRecord
  belongs_to :argument

  has_many :premise_sources, dependent: :delete_all
  has_many :sources, through: :premise_sources

  has_many :supporting_premises, foreign_key: "parent_premise_id", dependent: :delete_all
  has_many :premises, through: :supporting_premises

end
