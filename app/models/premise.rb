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
  belongs_to :argument, optional: true

  has_many :premise_sources, dependent: :delete_all
  has_many :sources, through: :premise_sources

  has_many :parent_premises, through: :parent_connections, source: :parent_premise
  has_many :parent_connections, foreign_key: 'premise_id', class_name: 'SupportingPremise'

  has_many :supporting_premises, through: :supporting_connections, source: :premise
  has_many :supporting_connections, foreign_key: 'parent_premise_id', class_name: 'SupportingPremise'

  def descendents
    supporting_connections.map do |child|
      [{premise: child.premise, connection: child}] + child.premise.descendents
    end.flatten
  end

  def self_and_descendents
    descendents.unshift({premise: self, connection: nil})
  end
end
