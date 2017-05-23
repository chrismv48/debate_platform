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

  has_many :supporting_connections, class_name: 'SupportingPremise', foreign_key: 'parent_premise_id', dependent: :delete_all
  has_many :supporting_premises, class_name: 'Premise', source: :premise, through: :supporting_connections

end
