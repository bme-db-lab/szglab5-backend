# TODO: documentation
#
class Deliverable < ActiveRecord::Base
  belongs_to :event
  belongs_to :deliverable_template
  belongs_to :upstream_deliverable, class_name: 'Deliverable'
  has_many :related_deliverables, class_name: 'Deliverable', foreign_key: 'upstream_deliverable_id'
  has_many :evaluations, as: :evaluatable
end
