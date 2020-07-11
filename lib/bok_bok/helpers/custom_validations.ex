defmodule BokBok.Helpers.CustomValidations do
  def validate_phone_number(field, phone_number) do
    valid? = Regex.match?(~r/\A\+\d{10,15}\z/, phone_number)

    if valid?,
      do: [],
      else: [
        {field, "must be of 10 to 15 digits, including country code starting with '+' symbol"}
      ]
  end
end
