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

require 'test_helper'

class PremiseTest < ActiveSupport::TestCase
  test "a premise can only have a single argument" do
    premises(:one).argument = arguments(:one)
    premises(:one).save
    assert_equal(Premise.where(argument_id: arguments(:one).id).count, 1)
  end
end
