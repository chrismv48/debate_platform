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

require 'test_helper'

class PremiseSourceTest < ActiveSupport::TestCase

  test "a premise has many sources" do
    premises(:one).sources = [sources(:one), sources(:two)]
    premises(:one).save
    assert_equal(Premise.find(premises(:one).id).sources.length, 2)
    assert_equal(PremiseSource.where(premise_id: premises(:one).id).count, 2)
  end
  test "a source has many premises" do
    sources(:two).premises = [premises(:one), premises(:two)]
    sources(:two).save
    assert_equal(Source.find(sources(:two).id).premises.length, 2)
    assert_equal(PremiseSource.where(source_id: sources(:two).id).count, 2)
  end

end
