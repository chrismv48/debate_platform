# == Schema Information
#
# Table name: arguments
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Argument < ApplicationRecord
  has_many :premises

  def get_tree
    tree = []
    premises.map do |premise|
      tree << premise.self_and_descendents
    end
    tree
  end
end
