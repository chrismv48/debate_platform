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

end
