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
  setup do
    @p1 = Premise.create(name: 'foo')
    @p2 = Premise.create(name: 'bar')
    @p1.supporting_premises.create(premise_id: @p2.id, parent_premise_id: @p1.id)
  end
  test "creating supporting premise should populate supporting_premises table" do
    assert_equal(SupportingPremise.where(premise_id: @p2.id).count, 1)
    assert_equal(SupportingPremise.where(parent_premise_id: @p1.id).count, 1)
  end

  test "deleting the parent premise deletes the connection to the supporting premise" do
    @p1.destroy
    assert_equal(SupportingPremise.where(parent_premise_id: @p1.id).count, 0)
  end

  test "deleting the child premise also deletes the connection to the parent premise" do
    @p1 = Premise.create(name: 'foo')
    @p1.supporting_premises.create(premise_id: @p2.id, parent_premise_id: @p1.id)
    @p2.destroy
    assert_equal(SupportingPremise.where(premise_id: @p2.id).count, 0)
  end
end
