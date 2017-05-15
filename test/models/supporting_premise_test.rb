# == Schema Information
#
# Table name: supporting_premises
#
#  id                :integer          not null, primary key
#  parent_premise_id :integer
#  premise_id        :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_supporting_premises_on_parent_premise_id  (parent_premise_id)
#  index_supporting_premises_on_premise_id         (premise_id)
#

require 'test_helper'

class SupportingPremiseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
