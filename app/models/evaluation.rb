# TODO: documentation
#
class Evaluation < ActiveRecord::Base
  belongs_to :evaluatable, polymorphic: true

  belongs_to :evaluation_type
  belongs_to :staff
end
