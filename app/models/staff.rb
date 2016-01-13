# TODO: documentation
#
class Staff < ActiveRecord::Base
  belongs_to :semester
  belongs_to :user, inverse_of: :staffs
  has_many :evaluations_given, class_name: 'Evaluation', foreign_key: 'staff_id'
end
