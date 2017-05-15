# == Schema Information
#
# Table name: premise_sources
#
#  id         :integer          not null, primary key
#  premise_id :integer
#  source_id  :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_premise_sources_on_premise_id  (premise_id)
#  index_premise_sources_on_source_id   (source_id)
#

class PremiseSource < ApplicationRecord
  belongs_to :premise
  belongs_to :source
end
