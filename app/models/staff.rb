# TODO: documentation
#
class Staff < ActiveRecord::Base
  belongs_to :semester
  belongs_to :user, inverse_of: :staffs
  has_many :evaluator_of_deliverables, class_name: 'Deliverable', foreign_key: 'evaluator_id'
end
