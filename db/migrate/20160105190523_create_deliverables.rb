class CreateDeliverables < ActiveRecord::Migration
  def change
    create_table :deliverables do |t|
      t.string :type, limit: 30
      t.datetime :deadline
      t.datetime :submitted_date
      t.string :title, limit: 30
      t.string :description
      t.references :event, index: true, foreign_key: true
      t.references :deliverable_template, index: true, foreign_key: true
      t.references :upstream_deliverable, index: true, foreign_key: {to_table: :deliverable}
      # Repositories-specfic stuff
      t.string :url, limit: 100
      t.string :commit, limit: 100
      # Files-specific stuff
      t.integer :size
      t.string :checksum_algorithm, limit: 30
      t.string :checksum
      t.string :filename, limit: 30
      t.references :directory, index: true, foreign_key: true

      t.timestamps
    end
  end
end
