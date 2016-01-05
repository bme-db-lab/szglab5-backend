class CreateDeliverables < ActiveRecord::Migration
  def change
    create_table :deliverables do |t|
      t.string :type, limit: 30
      t.datetime :deadline
      t.datetime :submitted_date
      t.integer :grade
      t.string :title, limit: 30
      t.string :description
      t.references :event, index: true, foreign_key: true
      t.references :deliverable_template, index: true, foreign_key: true
      t.references :evaluator, index: true, foreign_key: {to_table: :staff}
      t.references :upstream_deliverable, index: true, foreign_key: {to_table: :deliverable}

      t.timestamps
    end
  end
end
